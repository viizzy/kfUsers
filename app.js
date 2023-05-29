const express = require('express');
const casual = require('casual');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

class User{
  constructor(name = '', age = 0, email = '', address = '', phone = 0, zip = '', location = '', quote = ''){
    this.name = name;
    this.age = age;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.zip = zip;
    this.location = location;
    this.quote = quote;
  }

  displayInfo(){
    return `
      Name: ${this.name}           
      Age: ${this.age}             
      Email: ${this.email}         
      Address: ${this.address}
      Phone: ${this.phone}
      Zip: ${this.zip}
      Location: ${this.location}
      Quote: ${this.quote}
      `;
  }
}

class ExtendedUser extends User{
  constructor(name = '', age = 0, email = '', address = '', phone = 0, zip = '', location = '', additionalInfo = '', quote = ''){
    super(name, age, email, address, phone, zip, location, quote);
    this.additionalInfo = additionalInfo;
  }

  displayInfo(){
    return super.displayInfo() + `Additional Info: ${this.additionalInfo}`;
  }
}

async function generateFakeUsers(num){
  const fakeUsers = [];
  for (let i=0; i<num; i++) {
    const name = casual.full_name;
    const age = casual.integer(18, 70);
    const email = casual.email;
    const address = casual.address;
    const phone = casual.phone;
    const zip = casual.zip(5);
    const location = casual.latitude + ', ' + casual.longitude;
    const additionalInfo = casual.sentence;
    try{
      const response = await axios.get('https://api.kanye.rest');
      const quote = response.data.quote;
      const user = new ExtendedUser(name, age, email, address, phone, zip, location, additionalInfo, quote);
      fakeUsers.push(user);
    } catch(error){
      console.error(error);
      const quote = 'failed to fetch quote...';
      const user = new ExtendedUser(name, age, email, address, phone, zip, location, additionalInfo, quote);
      fakeUsers.push(user);
    }
  }
  return fakeUsers;
}

// fetching
// app.get('/test', async (req, res) => {
//   try {
//     const response = await axios.get('https://api.kanye.rest');
//     const quote = response.data.quote;
//     res.json({ quote });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch Kanye West quote' });
//   }
// });
//

const nUsers = 3; // setting up users manually
generateFakeUsers(nUsers).then(fakeUsers => {
  console.log(`Generated ${nUsers} users successfully`);
  const userInfo = fakeUsers.map(user => user.displayInfo()).join('\n');
  console.log(userInfo);

  for(let i=0; i<fakeUsers.length; i++){
    for(let j=0; j<fakeUsers.length-i-1; j++){
      if(fakeUsers[j].age > fakeUsers[j+1].age){
        const tmp = fakeUsers[j];
        fakeUsers[j] = fakeUsers[j+1];
        fakeUsers[j+1] = tmp;
      }
    }
  }
  
  console.log("Ascending order by age \n");
  const userInfoSortedByAge = fakeUsers.map(user => user.displayInfo()).join('\n');
  console.log(userInfoSortedByAge);
});

// if(process.env.PORT){
//   app.listen(process.env.PORT, () => {
//     console.log(`listening on port ${process.env.PORT}`);
//   });
// } else{
//   app.listen(port, () => {
//     console.log(`listening on port ${port}`);
//   });
// }
