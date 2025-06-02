import {tableGenerator} from "./tableGenerator";

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    let result = html + await tableGenerator(request,env) + footer;
    return new Response(result, {
      status: 200,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'no-cache',
      },
    });
  },
};


const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Saldo de Combustible</title>
  <style>
	body {
	  font-family: Arial, sans-serif;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  min-height: 100vh;
	  margin: 0;
	  background-color: #f4f4f9;
	}
	table {
	  border-collapse: collapse;
	  width: 90%;
	  max-width: 600px;
	  margin: 20px auto;
	  background: #fff;
	  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}
	th, td {
	  border: 1px solid #ddd;
	  padding: 8px;
	  text-align: center;
	}
	th {
	  background-color: #007BFF;
	  color: white;
	}
	tr:nth-child(even) {
	  background-color: #f2f2f2;
	}
	@media (max-width: 600px) {
	  table {
		font-size: 14px;
	  }
	}
  </style>
</head>
<body>
`;

const footer = `
</body>
</html>
`;