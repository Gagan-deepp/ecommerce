const bcrypt = require('bcrypt')

const hashPassword = async (password) =>{
    const saltRound = 10
    const hashedPssword = await bcrypt.hash(password , saltRound)
    return hashedPssword
}

const comparePassword = async (password , hashedPssword) => {
    return bcrypt.compare(password , hashedPssword)
}

module.exports = { hashPassword , comparePassword }