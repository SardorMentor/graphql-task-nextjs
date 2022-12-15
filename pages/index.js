import { useEffect, useState } from "react"
import Head from "next/head"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"

export default function Home() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const response = await fetch(
      "https://api-ap-south-1.hygraph.com/v2/clbnux5qh1k8r01t8b9jnhrco/master",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          query Students {
            students {
              firstName
              lastName
              age
            }
          }
      `,
        }),
      }
    )

    console.log(response)

    if (!response.ok) {
      throw new Error("Something went wrong!!!")
    } else {
      return response.json()
    }
  }

  useEffect(() => {
    fetchData()
      .then((data) => setStudents(data.data.students))
      .catch((err) => console.log("Error --> ", err))
      .finally(() => setLoading(false))
  }, [])

  // useEffect(() => {
  //   fetch(
  //     "https://api-ap-south-1.hygraph.com/v2/clbnux5qh1k8r01t8b9jnhrco/master",
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         query: `
  //           query Students {
  //             students {
  //               firstName
  //               lastName
  //               age
  //             }
  //           }
  //       `,
  //       }),
  //     }
  //   )
  //     .then((res) => {
  //       console.log(res)
  //       return res.json()
  //     })
  //     .then((data) => setStudents(data.data.students))
  // }, [])

  // useEffect(() => {
  //   fetch(
  //     "https://api-ap-south-1.hygraph.com/v2/clbnux5qh1k8r01t8b9jnhrco/master",
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         query: `
  //         mutation MyMutation {
  //           createStudent(data: {firstName: "Test name 255", lastName: "Last name 2", age: "29"}) {
  //           }
  //         }
  //       `,
  //       }),
  //     }
  //   )
  //     .then((res) => console.log(res))
  //     .catch((err) => console.log(err))
  // }, [])

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
              {loading ? (
                <div className="loading">Loading...</div>
              ) : (
                <TableBody>
                  {students?.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.firstName}</TableCell>
                      <TableCell>{item.lastName}</TableCell>
                      <TableCell>{item.age}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  )
}

// export async function getStaticProps() {
//   const { students } = await graphcms.request(QUERY)

//   return {
//     props: {
//       students,
//     },
//   }
// }
