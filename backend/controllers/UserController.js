const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../mongoDb/models/User');

exports.register = async (req, res) => {
  try {
    let { name, email, password, username } = req.body;
    if (!name || !email || !password) res.status(402).json({ error: 'Sent name, email, password' });
    password = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password,
      created_at: new Date(),
      username,
    });
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    user.token = token;
    await user.save();

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    console.log(password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'secret_key');

    user.token = token;
    await user.save();

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};