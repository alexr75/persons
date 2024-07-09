const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')


let people = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(cors())
app.use(express.json())

morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

app.get('/api/persons', (req, res) => {
	res.json(people)
})

app.get('/info', (req, res) => {
	const date = new Date()
	res.send(`
		<p>Phonebook has info for ${people.length} people</p>
		<p>${date}</p>
	`)
})

app.get('/api/persons/:id', (req, res) => {
	const id = req.params.id
	const person = people.find(person => person.id === id)
	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.post('/api/persons/', (req, res) => {
	const body = req.body

	if (!body.name) {
		return res.status(400).json({
			error: 'name missing'
		})
	}
	if (!body.number) {
		return res.status(400).json({
			error: 'number missing'
		})
	}

	const exists = people.find(person => person.name === body.name)
	if (exists) {
		return res.status(400).json({
			error: 'name must be unique'
		})
	}

	const person = {
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random() * 1000000).toString()
	}

	people = people.concat(person)
	res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
	const id = req.params.id
	people = people.filter(person => person.id !== id)
	res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})