const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user.js')
const auth = require('../middleware/auth.js')
const { sendWelcomeEmail,sendCancellationEmail } = require('../emails/accounts.js')


const router = new express.Router()



//create a new user
router.post('/users', async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthenticationToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

//login a user
router.post('/users/login', async (req,res)=>{
    try{
        //newly created function in schema
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthenticationToken()
        res.send({user,token})
    }catch(error){
        res.status(400).send({error: error.message})
    }
})

//logout
router.post('/users/logout', auth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=> token.token !== req.token)

        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send()
    }
})

//get my profile
router.get('/users/me', auth, async (req,res)=>{
    //req.user is set in auth function in middleware
    res.send(req.user)
})

//old method used to get a specific user
//recall the :id way used to pass params
// router.get('/users/:id', auth, async (req,res)=>{
//     //note :variable is how to pass request parameters 
//     try {
//         const user = await User.findById(req.params.id)
//         if (user){
//             return res.send(user)
//         }
//         res.status(404).send()
//     }catch(e){
//         res.status(400).send()
//     }
// })

//update any fields of a user you want
router.patch('/users/me', auth, async (req, res)=>{
    const updateFields = Object.keys(req.body)
    try{
        updateFields.forEach((update)=>{
            req.user[update] = req.body[update]
        })
        await req.user.save()

        if (req.user){
            return res.send(req.user)
        }
        res.status(404).send()
    }catch(e){
        res.status(400).send()
    }
})

//delete your account
router.delete('/users/me', auth, async (req,res)=>{
    try{
        await req.user.remove()
        //const user = await User.findByIdAndDelete(req.user._id)
        sendCancellationEmail(req.user.email, req.user.name)
        return res.send(req.user)
        
    }catch(e){
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 3000000
    },
    fileFilter(req,file,cb) {
        cb(undefined,true)
    }
})

//upload or update a profile pic
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res)=>{
    //because in uplaod we dont set the 'dest' field, the file being uploaded is passed to the request as req.file
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
})

//delete profile pic
router.delete('/users/me/avatar', auth, async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(404).send({error: error.message})
})

//get avatar of specific user. The link used to fetch this image can directly be put into html document
router.get('/users/:id/avatar', async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()

    }
    
})


module.exports = router
