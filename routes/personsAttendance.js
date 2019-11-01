const express = require("express");
const Router = express.Router();
const moment = require("moment");
const Op = require("sequelize").Op;
const { departments, leaveTypes } = require("../config/keys")
const { User, Person, Present, Leave } = require("../models");


Router.route("/data").get(async (req, res) => {
  console.log("req.params----------", req.query);
  const { startDate, endDate, rowsPerPage, page, department } = req.query;
  const limit = Number(page*rowsPerPage + rowsPerPage)
  const offset = page*rowsPerPage
  let whereData = {}
  if(department){
    whereData = {
      department
    }
  }

  let persons = await Person.findAll({
      attributes: ['regNo', 'name', 'cardNo', 'department'],
      limit,
      offset,
      order: [
        ['regNo', 'ASC']
      ],
      raw: true,
      where: whereData
  })
  let personsCount = await Person.count({raw: true, where: whereData})
  let finalStructure = {};
  let result = {};
  // console.log("----------persons-------", persons)


  await Promise.all(
    persons.map(async person => {
      let personObj;
      let sortedPersonObj = {};
      // console.log("--------startDate, endDate---------", startDate, endDate)
      //Query to get the present data of each user from startDate to endDate
      let presentDays = await Present.findAll({
          where: {
              regNo: person.regNo,
              entryDate: {
                  [Op.gte]: startDate,
                  [Op.lte]: endDate
              }
          },
          raw: true
      })

      let leaveDays = await Leave.findAll({
        where: {
          regNo: person.regNo,
          [Op.or]: [
           {
            [Op.and]: [
              {
                fromDate: {
                  [Op.gte]: startDate
                },
                toDate: {
                  [Op.lte]: endDate
                }
              }
            ]
           },
           {
            [Op.and]: [
              {
                toDate: {
                  [Op.gte]: startDate
                },
                toDate: {
                  [Op.lte]: endDate
                }
              }
            ]
           },
           {
            [Op.and]: [
              {
                fromDate: {
                  [Op.gte]: startDate
                },
                fromDate: {
                  [Op.lte]: endDate
                }
              }
            ]
           }
          ]
          
        },
        raw: true
      })


      // console.log("---------------presentDays-------------", presentDays);
      // console.log("---------------leaveDays-------------", leaveDays);

      result[person.regNo] = {};

      presentDays.forEach(element => {
        result[person.regNo][`${element.entryDate}`] = element.noOfHours;
      });

      leaveDays.forEach(element => {
        const { fromDate, toDate, reason } = element
        for (
          let i = fromDate;
          i <= toDate;
          i = moment(i)
            .add(1, "days").format('YYYY-MM-DD')
        ) {
          if(i>=startDate && i<=endDate){
            // console.log(`for user ${user.RegNo} i is ${i}`)
            result[person.regNo][`${i}`] = reason;
          }
          
        }
      });

      for (
        let j = startDate;
        j <= endDate;
        j = moment(j)
          .add(1, "days").format('YYYY-MM-DD')
      ) {
        // console.log(`for person ${person.regNo} j is ${j}`, moment(j).format('ddd'))
        const day = moment(j).format('ddd')
        const exceptDays = ['Sat', 'Sun']
        if (!result[person.regNo][`${j}`]) {
          if(exceptDays.includes(day)){
            result[person.regNo][`${j}`] = "WeekOff";
          }else{
            result[person.regNo][`${j}`] = "AB";

          }
        }
      }

      personObj = result[person.regNo];

      
      sortedPersonObj['RegNo'] = person.regNo
      sortedPersonObj['Name'] = person.name
      sortedPersonObj['CardNo'] = person.cardNo
      sortedPersonObj['Department'] = person.department

      Object.keys(personObj)
        .sort()
        .forEach(key => {
          // console.log("============key==========", key)
          const date = moment(key).format('DD MMM YY(ddd)')
          sortedPersonObj[`${date}`] = personObj[key];
        });
      result[person.regNo] = sortedPersonObj;
    })
  );

  // console.log("-------------Result-----------", result)

  Object.keys(result).forEach(key => {
    finalStructure[key] = Object.values(result[key]);
  });

  const tableColumnHeaders = Object.keys(result[Object.keys(finalStructure)[0]]).map(element=>{
    return {
      label: element
    }
  })

  const tableColumnData = Object.values(result).map(element=>{
    return Object.values(element)
  })


  // console.log("--------tableColumnHeaders---------", tableColumnHeaders)

  // console.log("--------tableColumnData---------", tableColumnData)


  res.status(200).json({
    usersCount: personsCount,
    usersData: persons,
    usersAttendance: finalStructure,
    tableColumnHeaders,
    tableColumnData,
    departments,
    leaveTypes
  });
});


module.exports = Router;
