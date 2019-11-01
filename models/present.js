module.exports = (sequelize, type)=>{
    return sequelize.define(
        'present',
        {
            regNo: {
                type: type.BIGINT,
            },
            entryDate: {
                type: type.DATEONLY,
            },
            inTime: {
                type: type.TIME
            },
            outTime: {
                type: type.TIME
            },
            noOfHours: {
                type: type.FLOAT
            },
        },
        {
            timestamps: false,
        }
    )
}