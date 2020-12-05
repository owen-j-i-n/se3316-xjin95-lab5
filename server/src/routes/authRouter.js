const authMiddleware = require('../middleware/auth')
const authController = require('../controllers/auth')

module.exports = function (app) {
  app.post('/login', authController.login)
  app.get('/loginByGithub',authController.loginByGithub)
  app.get("/github/callback",authController.GithubCallback)
  app.get('/validateToken', authMiddleware, authController.validateToken)
  app.get("/activate_account",authController.activate_account)
  app.get('/get_courses',authController.get_courses)
  app.get('/get_courseList',authMiddleware,authController.get_courseList)
  app.get('/course_list_name_duplicated',authController.course_list_name_duplicated)
  app.post("/edit_course_list",authController.edit_course_list)
  app.post("/add_course_list",authController.add_course_list)
  app.get("/delete_courseList",authMiddleware,authController.delete_courseList)
  app.post('/add_review',authMiddleware,authController.add_review)
  app.get("/hide_review",authController.hide_review)
  app.get("/change_user",authController.change_user_state)
  app.get("/get_users",authMiddleware,authController.get_users)
  app.post("/register", authController.register)
}
