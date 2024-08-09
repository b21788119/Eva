<ul>
  <li>
    This repository contains a basic REST API built with Node.js, Express.js, Sequelize, and PostgreSQL, all packaged together using Docker for easy deployment and scalability.
  </li>
  <li>
    The API is designed with a monolithic architectural style, but its structure allows for seamless conversion to a microservices architecture if the need arises.
  </li>
  <li>
    Certain complexities have been intentionally omitted, including logic for race conditions, management of share quantity in the market (considered infinite), and detailed buy/sell operations.
  </li>
  <li>
    Some statistical calculations about the portfolios and portfolio shares were considered, and the repository will be updated as I dive deeper into making the app more applicable to real-life scenarios.
  </li>
  <li>
    <strong>Basic Representation of Entities and Relationships:</strong>
    <br><br>
    <img src="/BasicErDiagram.png" width="200">
  </li>
  <li>
    <strong>DB Schema:</strong>
    <br><br>
    <img src="/DBSchema.png" width="200">
  </li>
  <li>
    <strong>Postman Collection:</strong>
    <br><br>
    <a href="/Postman_collection.json" download>Click Here</a>
  </li>
</ul>
