const Models=require('../models/Models');
const Buzz=Models.buzzModel;
module.exports=(req,res,next)=>{
    const {buzzId} = req.body.data;
    const {user} =req.body;

    let routePath=req.route.path;
    if(routePath==='/like')
    {
        Buzz.find({$and:[{_id:buzzId},{'dislike.user':user}]})
            .then(result=>{
                if(result.length){
                    let dislike={user}
                    Buzz.updateOne({_id:buzzId},
                        {$pull:{dislike:dislike}})
                        .catch(err=>{
                            res.sendStatus(500);
                        })
                }

            })
    }
    else if(routePath==='/dislike')
    {
        Buzz.find({$and:[{_id:buzzId},{'like.user':user}]})
            .then(result=>{
                if(result.length){
                    let like={user}
                    Buzz.updateOne({_id:buzzId},
                        {$pull:{like:like}})
                        .catch(err=>{
                            res.sendStatus(500);
                        })
                }

            })
    }
    next();
}