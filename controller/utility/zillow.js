var Zillow  = require('node-zillow');

var zwsid = "X1-ZWz1f5677kiadn_6bk45"; //process.env.ZILLOW_KEY
var zillow = new Zillow(zwsid);



 module.exports = {
    tryZillow:(cb)=> {
        zillow.get('GetZestimate', {zpid: 1111111})
        .then(function (results) {
            cb(results)
        });
    },
    deepSearch:(parameters)=>{
        return zillow.get('GetDeepSearchResults', parameters);
    },
    propertyDetails: (parameters)=>{
        return zillow.get('GetUpdatedPropertyDetails', parameters);
    },
    cleanDeepSearch: (results)=>{
        try {
            if (results.message.code !== "0"){
                return [422, results.message.text]
            }
            var allDeepResults = results.response.results.result[0];
            zillowDeepResults = {
                address: [allDeepResults.address[0].street[0], allDeepResults.address[0].city[0], allDeepResults.address[0].state[0], allDeepResults.address[0].zipcode[0]].join(", "),
                bathrooms: allDeepResults.bathrooms[0],
                bedrooms: allDeepResults.bedrooms[0],
                estimate: allDeepResults.zestimate[0].amount[0],
                estimate_from_tax: allDeepResults.taxAssessment ? allDeepResults.taxAssessment[0] : undefined,
                lastSoldPrice: allDeepResults.lastSoldPrice ? allDeepResults.lastSoldPrice[0] : undefined,
                lastSoldDate: allDeepResults.lastSoldDate ?  allDeepResults.lastSoldDate[0] : undefined,
                property_id: allDeepResults.zpid[0]
            };
            return [200, zillowDeepResults];
        }
        catch (err){
            console.log(err);
            return [500, err]
        }
    },
    cleanPropertyDetails: (results)=>{
        try {
            if (results.message.code !== "0"){
                return [422, results.message.text]
            }
            var allDetailResults = results.response;
            zillowDetailResults = {
                description: allDetailResults.homeDescription,
                images: allDetailResults.images.image ? allDetailResults.images.image[0].url : undefined
            };
            return zillowDetailResults;
        }
        catch (err){
            console.log(err);
            return undefined
        }
    }
 }