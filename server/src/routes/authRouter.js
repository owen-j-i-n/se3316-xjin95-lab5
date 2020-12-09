const authMiddleware = require('../middleware/auth')
const authController = require('../controllers/auth')

module.exports = function (app) {
  app.post('/api/login', authController.login)
  app.get('/api/loginByGithub',authController.loginByGithub)
  app.get("/api/github/callback",authController.GithubCallback)
  app.get('/api/validateToken', authMiddleware, authController.validateToken)
  app.get("/api/activate_account",authController.activate_account)
  app.get('/api/get_courses',authController.get_courses)
  app.get('/api/get_courseList',authMiddleware,authController.get_courseList)
  app.get('/api/course_list_name_duplicated',authController.course_list_name_duplicated)
  app.post("/api/edit_course_list",authController.edit_course_list)
  app.post("/api/add_course_list",authController.add_course_list)
  app.get("/api/delete_courseList",authMiddleware,authController.delete_courseList)
  app.post('/api/add_review',authMiddleware,authController.add_review)
  app.get("/api/hide_review",authController.hide_review)
  app.get("/api/change_user",authController.change_user_state)
  app.get("/api/get_users",authMiddleware,authController.get_users)
  app.post("/api/register", authController.register)
}

