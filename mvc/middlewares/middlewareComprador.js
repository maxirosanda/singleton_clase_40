export const auth = (req,res,next)=>{

    if(req.isAuthenticated()) {
    if(req.user.tipo_usuario=="comprador" || req.user.tipo_usuario=="editor" || req.user.tipo_usuario=="admin" ){
        next()
    }else{
        res.send("error usuario no autorizado")
    }
    } else {
     res.send("error usuario no autorizado")
}}