const router = require("express").Router({mergeParams:true});
const authService = require("../service/authService");
router.get('/', async (req, res, next) => {
  return res.send('Welcome To Ahmed Hussein App :))) ^ _ ^');
});
router.post('/addRelease', async (req, res, next) => {
  try {
    user = await authService.addNewRelease(req.body);
    res.send(user);
  } catch (err) {
    next(err);
  }
});
router.delete('/deleteRelease/:releaseId', async (req, res, next) => {
  try {
    user = await authService.deleteRelease(req.params.releaseId);
    res.send(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
