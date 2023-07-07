const app = require( './app' );
const PORT = 1990;

app.listen( PORT, () => {
    console.log(`Server is listening to port: ${PORT}`);
})