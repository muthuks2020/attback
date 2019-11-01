module.exports = (sequelize, type)=>{
    return sequelize.define(
        'leaves',
        {
            regNo: {
                type: type.BIGINT,
            },
            fromDate: {
                type: type.DATEONLY,
            },
            toDate: {
                type: type.DATEONLY,
            },
            noOfDays: {
                type: type.INTEGER
            },
            reason: {
                type: type.ENUM,
                values: ['Loss Of Pay', 'Comp Off', 'Paid Leave', 'Paternity Leave', 'Restricted Holiday', 'Business Travel', 'Work From Home', 'Other']
            }
        },
        {
            timestamps: false,
        }
    )
}