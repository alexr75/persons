require('dotenv').config()

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URL)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
  const name = process.argv[2]
  const number = process.argv[3]
  const person = new Person({ name, number })
  person.save().then(() => {
    console.log(`added ${name} ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(people => {
    console.log('phonebook:')
    people.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
