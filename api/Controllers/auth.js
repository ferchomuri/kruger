const { Users, Employees, Vaccines } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const secret = process.env.SECRET_JWT;

exports.loginHandler = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({
      where: {
        [Op.or]: [{ DNI: username }],
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userID: user.userID, username: user.DNI, isAdmin: user.isAdmin },
      secret,
      {
        expiresIn: "1d",
      }
    );

    await Users.update({ accessToken: token }, { where: { userID: user.userID } });

    const employee = await Employees.findOne({
      where: {
        employeeID: user.employeeID,
      },
    });

    const vaccine = await Vaccines.findOne({
      where: {
        vaccineID: employee.vaccineID,
      },
    });

    return res.json({
      user: {
        userID: user.userID,
        DNI: user?.DNI,
        isAdmin: user.isAdmin,
        name: employee?.name,
        lastName: employee?.lastName,
        email: employee?.email,
        dateOfBirth: employee?.dateOfBirth,
        address: employee?.address,
        phone: employee?.phone,
        vaccinationStatus: employee?.vaccinationStatus,
        vaccine: vaccine?.name,
        vaccineDate: employee?.vaccineDate,
        numberOfDose: employee?.numberOfDose,
        employeeID: user?.employeeID,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.logoutHandler = (req, res) => {

  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token is not found" });
  }

  token = token.split(" ")[1];

  //decrypted token
  const decoded = jwt.verify(token, secret);

  Users.update({ accessToken: null }, { where: { userID: decoded.userID } });

  res.json({ message: "Logout successful" });
}

exports.handleProfile = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await Users.findOne({
      where: {
        [Op.or]: [{ DNI: username }],
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid username or password" });
    }

    const employee = await Employees.findOne({
      where: {
        employeeID: user.employeeID,
      },
    });

    const vaccine = await Vaccines.findOne({
      where: {
        vaccineID: employee.vaccineID,
      },
    });

    return res.json({
      user: {
        userID: user.userID,
        DNI: user?.DNI,
        isAdmin: user.isAdmin,
        name: employee?.name,
        lastName: employee?.lastName,
        email: employee?.email,
        dateOfBirth: employee?.dateOfBirth,
        address: employee?.address,
        phone: employee?.phone,
        vaccinationStatus: employee?.vaccinationStatus,
        vaccinationStatusText: employee?.vaccinationStatus === 1 ? "Vacunado" : user.Employee?.vaccinationStatus === 0 ? "No vacunado" : "Sin información",
        vaccine: vaccine?.name,
        vaccineDate: employee?.vaccineDate,
        numberOfDose: employee?.numberOfDose,
        employeeID: employee?.employeeID,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.handleRegister = async (req, res) => {
  const { DNI, password, name, lastName, email } = req.body;
  const existingUser = await Users.findOne({
    where: {
      [Op.or]: [{ DNI: DNI }],
    },
  });

  if (existingUser) {
    return res.status(400).json({
      ok: false,
      message: "El usuario ya existe",
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newEmployee = await Employees.create({
    name,
    lastName,
    email,
    createdAt: new Date(),
  });

  const newUser = await Users.create({
    DNI,
    password: hashedPassword,
    employeeID: newEmployee.employeeID,
    isAdmin: false,
    createdAt: new Date(),
  });

  return res.json({
    ok: true,
    data: {
      DNI: newUser.DNI,
      userID: newUser.userID,
    },
  });
};

exports.getAllAccounts = async (req, res) => {
  try {
    let users = await Users.findAll({
      attributes: {
        exclude: ["password", "accessToken", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: Employees,
          attributes: ["name", "lastName", "email", "dateOfBirth", "address", "phone", "vaccinationStatus", "vaccineID", "vaccineDate", "numberOfDose"],
          include: [Vaccines]
        }
      ]
    });

    // Remove the admin user from the list
    users = users.filter(user => !user.isAdmin);

    // Map each user to include employee and vaccine information
    users = users.map(user => ({
      userID: user.userID,
      name: user.Employee.name,
      lastName: user.Employee.lastName,
      email: user.Employee.email,
      dateOfBirth: user.Employee?.dateOfBirth || null,
      address: user.Employee.address || null,
      phone: user.Employee.phone || null,
      vaccinationStatus: !!user.Employee.vaccinationStatus,
      vaccinationStatusText: user.Employee.vaccinationStatus === 1 ? "Vacunado" : user.Employee.vaccinationStatus === 0 ? "No vacunado" : "Sin información",
      vaccioneID: user.Employee.Vaccine?.vaccineID || null,
      vaccine: user.Employee.Vaccine?.name || null,
      vaccineDate: user.Employee?.vaccineDate || null,
      numberOfDose: user.Employee?.numberOfDose || null,
    }));

    return res.json({
      ok: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
};

exports.changeInformationEmployeeHandler = async (req, res) => {
  let { name, lastName, email, dateOfBirth, address, phone, vaccineID, vaccineDate, vaccinationStatus, numberOfDose } = req.body;
  const { id } = req.params;

  try {

    numberOfDose = parseInt(numberOfDose);
    const updatedAt = new Date();

    const updatedEmployee = await Employees.update(
      { name, lastName, email, dateOfBirth, address, phone, vaccineID, vaccineDate, vaccinationStatus, numberOfDose, updatedAt },
      { where: { employeeID: parseInt(id) } }
    );

    if (updatedEmployee[0] === 1) {
      res.json({ message: "Employee information updated successfully" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.deleteUserHandler = async (req, res) => {
  const { id } = req.params;

  try {

    const isAdmin = await Users.findOne({
      where: {
        userID: id,
      },
    });

    if (isAdmin.isAdmin) {
      return res.status(401).json({ message: "This user is Admin" });
    }

    const deletedUser = await Users.destroy({ where: { userID: id } });

    const deletedEmployee = await Employees.destroy({ where: { employeeID: isAdmin.employeeID } });

    if (deletedUser === 1 && deletedEmployee === 1) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
