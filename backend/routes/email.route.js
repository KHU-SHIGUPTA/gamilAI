const express=require('express');
const router=express.Router();
const {createEmail,deleteEmail,getAllEmailById}=require('../controllers/email.controller')
const isAuthenticated=require("../middleware/isAuthenticated")

router.post('/create',isAuthenticated,createEmail);
router.delete("/:id",isAuthenticated,deleteEmail)
router.get("/getAllEmail",isAuthenticated,getAllEmailById)
module.exports=router;