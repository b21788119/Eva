<h3>Case Overview</h3>
<br>
<ul>
  <li>
    This repository includes a basic REST API developed using Node.js, Express.js, Sequelize, and PostgreSQL, all packaged with Docker for seamless deployment and scalability.
  </li>
  <li>
    The API is built with a monolithic architecture, but it can be easily adapted to a microservices architecture if needed.
  </li>
  <li>
    Certain complexities, such as race condition handling, managing share quantities in the market (assumed to be infinite), and detailed buy/sell operation logic, have been intentionally excluded.
  </li>
  <li>
    Some basic statistical calculations for portfolios and portfolio shares have been implemented. The repository will be updated as I work on making the app more relevant to real-world use cases.
  </li>
  <li>
    Some endpoints were created as templates. In a live environment, these may require admin privileges and authorization.
  </li>
  <li>
    <strong>Basic Representation of Entities and Relationships:</strong>
    <br><br>
    <img src="/BasicErDiagram.png" width="200">
  </li>
  <li>
    <strong>DB Schema:</strong>
    <br><br>
    <img src="/DB Schema.png" width="200">
  </li>
  <li>
    <strong>Postman Collection:</strong>
    <br><br>
    <a href="/Postman_collection.json" download>Click Here</a>
  </li>
  <li>
    <p>To run the applications in a Docker environment, navigate to the project directory and execute the following command:</p>
  <pre><code>docker compose up --build --force-recreate</code></pre>
  
  <p>This command will build the Docker images, force a recreation of the containers, and start the applications within the Docker environment.</p>
  </li>
</ul>
