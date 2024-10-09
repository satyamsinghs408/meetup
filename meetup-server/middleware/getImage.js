const getImage = (req, res, next) => {
    const {enteredName} = req.body;
    console.log(req.body);
    next();
    
}
module.exports = getImage;