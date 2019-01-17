import User from '../sequelize';
import passport from 'passport';

/**
 * @swagger
 * /updateUser:
 *   put:
 *     tags:
 *       - Users
 *     name: Update User
 *     summary: Update user info
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: object
 *           properties:
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             email:
 *               type: string
 *             username:
 *               type: string
 *             required:
 *               - username
 *     responses:
 *       200:
 *         description: User info updated
 *       403:
 *         description: No authorization / user not found
 */

module.exports = app => {
  app.put('/updateUser', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info != undefined) {
        console.log(info.message);
        res.status(403).send(info.message);
      } else {
        User.findOne({
          where: {
            username: req.body.username,
          },
        }).then(user => {
          if (user != null) {
            console.log('user found in db');
            user
              .update({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
              })
              .then(() => {
                console.log('user updated');
                res.status(200).send({ auth: true, message: 'user updated' });
              });
          } else {
            console.log('no user exists in db to update');
            res.status(401).send('no user exists in db to update');
          }
        });
      }
    })(req, res, next);
  });
};
