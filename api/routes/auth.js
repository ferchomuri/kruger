const express = require("express");
const router = express.Router();
const authController = require("../Controllers/auth");
const authMiddleware = require("../Middleware/auth");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login endpoint
 *     description: Endpoint for user login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 required: true
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 required: true
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Unauthorized
 */

router.post("/login", authController.loginHandler);

/**
 * @swagger
 * /auth/profile:
 *   post:
 *     summary: Profile endpoint
 *     description: Endpoint for user profile
 *     tags:
 *       - Authentication
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Access token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful profile retrieval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     userID:
 *                       type: integer
 *                     DNI:
 *                       type: string
 *                     isAdmin:
 *                       type: boolean
 *                     name:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                     address:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     vaccinationStatus:
 *                       type: integer
 *                     vaccinationStatusText:
 *                       type: string
 *                     vaccine:
 *                       type: string
 *                     vaccineDate:
 *                       type: string
 *                       format: date
 *                     numberOfDose:
 *                       type: integer
 *                     employeeID:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */


router.post(
  "/profile",
  authMiddleware.tokenValidator,
  authController.handleProfile
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register endpoint
 *     description: Endpoint for user registration
 *     tags:
 *       - Authentication
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Access token
 *         required: true
 *         type: string
 *       - name: body
 *         in: body
 *         description: User details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Successful registration
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router.post(
  "/register",
  authMiddleware.tokenValidator,
  authMiddleware.adminChecker,
  authController.handleRegister
);

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users endpoint
 *     description: Endpoint to get all user accounts
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Access token
 *         required: true
 *         schema:
 *           type: string
 *           format: jwt
 *           example: Bearer eyJh...
 *     responses:
 *       '200':
 *         description: Successful retrieval of user accounts
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */


router.get(
  "/users",
  authMiddleware.tokenValidator,
  authMiddleware.adminChecker,
  authController.getAllAccounts
);

/**
 * @swagger
 * /auth/update-employee/{id}:
 *   put:
 *     summary: Update employee endpoint
 *     description: Endpoint to update employee information
 *     tags:
 *       - Authentication
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Access token
 *         required: true
 *         type: string
 *       - name: id
 *         in: path
 *         description: Employee ID
 *         required: true
 *         type: string
 *       - name: body
 *         in: body
 *         description: Employee details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             age:
 *               type: number
 *     responses:
 *       200:
 *         description: Successful update of employee information
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router.put(
  "/update-employee/:id",
  authMiddleware.tokenValidator,
  authController.changeInformationEmployeeHandler
);

/**
 * @swagger
 * /auth/delete-users/{id}:
 *   delete:
 *     summary: Delete user endpoint
 *     description: Endpoint to delete a user
 *     tags:
 *       - Authentication
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Access token
 *         required: true
 *         type: string
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful deletion of user
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router.delete(
  "/delete-users/:id",
  authMiddleware.tokenValidator,
  authMiddleware.adminChecker,
  authController.deleteUserHandler
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout endpoint
 *     description: Endpoint for user logout
 *     tags:
 *       - Authentication
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Access token
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful logout
 *       401:
 *         description: Unauthorized
 */

router.post("/logout",
  authMiddleware.tokenValidator,
  authController.logoutHandler
);

module.exports = router;
