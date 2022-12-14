import Head from "next/head"
import { GraphQLClient, gql } from "graphql-request"
import { gql as apollo } from "@apollo/client"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"

const graphcms = new GraphQLClient(
  "https://api-ap-south-1.hygraph.com/v2/clbnux5qh1k8r01t8b9jnhrco/master"
)

const QUERY = gql`
  {
    students {
      firstName
      lastName
      age
    }
  }
`

const QUERY_CREATE = apollo`
  mutation createUser(
    $firstName: String!
    $secondName: String!
    $age: String!
  ) {
    createUser(firstName: $firstName, secondName: $secondName, age: $age) {
      firstName
      lastName
      age
    }
  }
`

export default function Home({ students }) {
  console.log(students)

  return (
    <div className="container">
      <Head>
        <title>GraphQL</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="wrapper">
        <div className="left">
          <h1 className="title">GraphQL</h1>
          <TextField
            id="outlined-basic"
            label="First name"
            variant="outlined"
            sx={{ width: "100%" }}
          />
          <TextField
            id="outlined-basic"
            label="Last name"
            variant="outlined"
            sx={{ width: "100%" }}
          />
          <TextField
            id="outlined-basic"
            label="Age"
            variant="outlined"
            sx={{ width: "100%" }}
          />
          <Button variant="contained" size="large">
            Add student
          </Button>
        </div>

        <div className="right">
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>First name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Last name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Age</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.firstName}</TableCell>
                    <TableCell>{item.lastName}</TableCell>
                    <TableCell>{item.age}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const { students } = await graphcms.request(QUERY)

  return {
    props: {
      students,
    },
  }
}
