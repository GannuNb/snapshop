import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 2. Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash password (HERE, NOT MODEL)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "buyer",
    });

    // 5. Response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Compare password (HERE)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Success response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




/* GET SAVED ADDRESSES */
export const getMyAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("savedAddresses");
    res.json(user.savedAddresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ADD NEW ADDRESS */
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const newAddress = req.body;

    // ⭐ CHECK DUPLICATE
    const exists = user.savedAddresses.find(
      (a) =>
        a.fullName === newAddress.fullName &&
        a.phone === newAddress.phone &&
        a.addressLine === newAddress.addressLine &&
        a.city === newAddress.city &&
        a.state === newAddress.state &&
        a.pincode === newAddress.pincode
    );

    if (!exists) {
      // remove default from old addresses
      user.savedAddresses.forEach((a) => (a.isDefault = false));

      // add new as default
      user.savedAddresses.push({
        ...newAddress,
        isDefault: true,
      });
    }

    await user.save();

    res.status(201).json(user.savedAddresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* EDIT ADDRESS */
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    const addr = user.savedAddresses.id(addressId);
    if (!addr) return res.status(404).json({ message: "Address not found" });

    Object.assign(addr, req.body);

    await user.save();

    res.json(user.savedAddresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE ADDRESS */
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    // ❌ prevent deleting last address
    if (user.savedAddresses.length <= 1) {
      return res
        .status(400)
        .json({ message: "At least one address is required" });
    }

    user.savedAddresses = user.savedAddresses.filter(
      (a) => a._id.toString() !== addressId
    );

    // ensure one default
    const hasDefault = user.savedAddresses.some((a) => a.isDefault);
    if (!hasDefault) user.savedAddresses[0].isDefault = true;

    await user.save();

    res.json(user.savedAddresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* SET DEFAULT ADDRESS */
export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    user.savedAddresses.forEach((a) => {
      a.isDefault = a._id.toString() === addressId;
    });

    await user.save();

    res.json(user.savedAddresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

