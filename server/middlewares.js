const authAdmin = (permissions) => {
    return (req, res, next) => {
        const userRole = "admin";  //He hardcodeado admin para tener permisos generales by default, volver a poner req.body.role
        //req.body.role
        if (permissions.includes(userRole)){
            next()
        } else {
            return res.status(401).json("Insufficient admin permits.")
        };
    };
};

const authUser = () => {
    return (req, res, next) => {
        const userId = req.params.userId;
        if (userId === req.body.userId) {
            next();
        } else {
            return res.status(401).json("Insufficient permits.");
        };
    };
};

module.exports = { authAdmin, authUser };