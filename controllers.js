
const multer = require('multer');
const slide = require('./models/slide');
const fs = require('fs');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let tempraryImageDirectory;
        if (process.env.DEV && process.env.DEV === 'Yes') {
            tempraryImageDirectory = path.join(__dirname, `../../tmp/`);
        } else {
            tempraryImageDirectory = '/tmp/';
        }
        cb(null, tempraryImageDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.replaceAll(' ', ""));
    }
});


const uploadFile = multer({ storage: storage }).single('file');

const home = (req, res, next) => {
    slide.find({},(err,data)=>{
        if (req.query !== {}) {
            res.render(path.join(__dirname, 'html', 'home.html'), { message: req.query.message, success: req.query.success, data: data });
        } else
            res.render(path.join(__dirname, 'html', 'home.html'), {data: data});
    }).sort({position:1})
    
}

const upload = (req, res, next) => {
    let tempraryImageDirectory;
        if (process.env.DEV && process.env.DEV === 'Yes') {
            tempraryImageDirectory = path.join(__dirname, `../../tmp/`);
        } else {
            tempraryImageDirectory = '/tmp/';
        }
        slide.find({},(err,data)=>{
            if (err){
                res.redirect("/?message=Slide Could not be Submitted&success=false");
                console.log(err)
            }
            else{
                
                let pos = data.length>0?data[0].position+1:0
                const newSlide = new slide({
                    image: {
                        data: fs.readFileSync(path.join(tempraryImageDirectory,req.file.filename)),
                        contentType: 'image/png'
                    },
                    name: req.file.filename,
                    position: pos
                })
                newSlide.save((err,d)=>{
                    if(err){
                        console.log(err)
                        res.redirect("/?message=Slide Could not be Submitted&success=false");
                    }
                    else
                        res.redirect("/?message=Slide has been Submitted&success=true");
                })
            }

        }).sort({position:-1}).limit(1)
    
}

const image = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    slide.findById(req.params.id,(err,data)=>{
        
        if (err)
            res.json({Error: err})
        else{
            
            res.send(`<img class="img-fluid" style="width: 100%;" src="data:image/ ${data.image.contentType};base64,${data.image.data.toString('base64')} " alt="..." >`)
            //res.render(path.join(__dirname, 'html', 'image.html'), {data: data});
        }
            
    })
}

const deleteSlide = (req, res, next) => {
    slide.findById(req.params.id,(err,data)=>{
        if (err){
            res.redirect("/?message=Slide Could not be deleted&success=false");
        }else{
            let pos = data.position
            slide.updateMany({position: { $gt: pos }},{ $inc: {position: -1}},{},(err,data)=>{
                if (err){
                    res.redirect("/?message=Slide Could not be deleted&success=false");
                }else{
                    slide.deleteOne({_id:req.params.id},(err,data)=>{
                        if (err){
                            res.redirect("/?message=Slide Could not be deleted&success=false");
                        }else{
                            console.log(data)
                            res.redirect("/?message=Slide has been Deleted&success=true");
                        }
                    })
                }
            })
        }
    })
    
}

const all = (req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");

    slide.find({},(err,data)=>{
        res.json(data);
    }).sort({position:1})
}

const moveup = (req, res, next)=>{
    slide.findById(req.params.id,(err,data)=>{
        if (err){
            res.redirect("/?message=Slide Could not be adjusted&success=false");
        }else{
            let pos = data.position
            if(pos>0){
                slide.findOneAndUpdate({position:pos-1},{ $inc: {position: 1} },{},(err,data)=>{
                    if (err){
                        res.redirect("/?message=Slide Could not be adjusted&success=false");
                    }else{
                        slide.findOneAndUpdate({_id:req.params.id},{ $inc: {position: -1} },{},(err,data)=>{
                            if (err){
                                res.redirect("/?message=Slide Could not be adjusted&success=false");
                            }else{
                                res.redirect("/?message=Slide has been adjusted&success=true");
                            }
                        })
                    }
                })
            }else{
                res.redirect("/?message=Slide Could not be adjusted&success=false");
            }
        }
    })
}

const movedown = (req, res, next)=>{
    slide.findById(req.params.id,(err,data)=>{
        if (err){
            res.redirect("/?message=Slide Could not be adjusted&success=false");
        }else{
            let pos = data.position
            
                slide.findOneAndUpdate({position:pos+1},{ $inc: {position: -1} },{},(err,data)=>{
                    if (err){
                        res.redirect("/?message=Slide Could not be adjusted&success=false");
                    }else{
                        slide.findOneAndUpdate({_id:req.params.id},{ $inc: {position: 1} },{},(err,data)=>{
                            if (err){
                                res.redirect("/?message=Slide Could not be adjusted&success=false");
                            }else{
                                res.redirect("/?message=Slide has been adjusted&success=true");
                            }
                        })
                    }
                })
            
        }
    })
}

const ids = (req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");

    slide.find({},{_id:1},(err,data)=>{
        if (err){
            res.json({Error: err})
        }else{
            res.json(data)
        }
    }).sort({position: 1})
}

module.exports = {
    home,
    uploadFile,
    upload,
    image,
    deleteSlide,
    all,
    moveup,
    movedown,
    ids
};
