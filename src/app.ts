import app from './config.js'

app.listen(app.get('PORT'), ()=>{
    console.log(`Server started at port ${app.get('PORT')}`)
})