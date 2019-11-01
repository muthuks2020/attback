module.exports = (sequelize, type)=>{
    return sequelize.define(
        'persons',
        {
            name: {
                type: type.STRING,
            },
            regNo: {
                type: type.BIGINT,
                primaryKey: true,
                unique: true
            },
            cardNo: {
                type: type.BIGINT
            },
            department: {
                type: type.ENUM,
                values: ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR']
            }
        },
        {
            timestamps: false,
        }
    )
}