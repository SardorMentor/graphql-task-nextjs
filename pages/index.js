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
  const initialValues = {
    firstName: "",
    lastName: "",
    age: "",
  }

  const [students, setStudents] = useState([])
  const [fetching, setFetching] = useState(false)
  const [submiting, setSubmiting] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [update, setUpdate] = useState(false)

  const fetchData = async () => {
    setFetching(true)
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
              id
            }
          }
      `,
        }),
      }
    )

    if (!response.ok) {
      throw new Error("Something went wrong!!!")
    } else {
      response
        .json()
        .then((data) => setStudents(data.data.students))
        .catch((err) => console.log("Error --> ", err))
        .finally(() => setFetching(false))
    }
  }

  const fetchItem = async (id) => {
    setFetching(true)
    const response = await fetch(
      "https://api-ap-south-1.hygraph.com/v2/clbnux5qh1k8r01t8b9jnhrco/master",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          query getStudent {
            student(where: {id: "${id}"}) {
              firstName
              lastName
              age
              id
            }
          }
      `,
        }),
      }
    )

    if (!response.ok) {
      throw new Error("Something went wrong!!!")
    } else {
      response
        .json()
        .then((data) => setValues(data.data.student))
        .catch((err) => console.log("Error --> ", err))
        .finally(() => setFetching(false))
    }
  }

  const submitData = async (values) => {
    let query = ""
    if (update) {
      setUpdating(true)
      query = `
      mutation MyMutation {
        updateStudent(data: {firstName: "${values.firstName}", lastName: "${values.lastName}", age: "${values.age}"}, where: {id: "${values.id}"}) {
          id
        }
        publishManyStudents(to: PUBLISHED) {
          count
        }
      }
      `
    } else {
      setSubmiting(true)

      query = `
      mutation createStudent {
        createStudent(data: {firstName: "${values.firstName}", lastName: "${values.lastName}", age: "${values.age}"}) {
          id
        }
        publishManyStudents(to: PUBLISHED) {
          count
        }
      }
      `
    }

    const response = await fetch(
      "https://api-ap-south-1.hygraph.com/v2/clbnux5qh1k8r01t8b9jnhrco/master",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
        }),
      }
    )

    if (!response.ok) {
      throw new Error("Something went wrong!!!")
    } else {
      setSubmiting(false)
      setUpdate(false)
      setUpdating(false)
      setValues(initialValues)
      fetchData()
    }
  }

  const deleteData = async (id) => {
    setDeleting(true)
    const query = `
      mutation createStudent {
        deleteStudent(where: {id: "${id}"}) {
          id
        }
      }
      `

    const response = await fetch(
      "https://api-ap-south-1.hygraph.com/v2/clbnux5qh1k8r01t8b9jnhrco/master",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
        }),
      }
    )

    if (!response.ok) {
      throw new Error("Something went wrong!!!")
    } else {
      setDeleting(false)
      fetchData()
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    submitData(values)
  }

  const deleteHandler = (id) => {
    deleteData(id)
  }

  const changeHandler = (id) => {
    setUpdate(true)
    fetchItem(id)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="container">
      <Head>
        <title>GraphQL</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="wrapper">
        <form onSubmit={submitHandler} className="left">
          <h1 className="title">GraphQL</h1>
          <TextField
            id="outlined-basic"
            label="First name"
            variant="outlined"
            sx={{ width: "100%" }}
            required
            value={values.firstName}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, firstName: e.target.value }))
            }
          />
          <TextField
            id="outlined-basic"
            label="Last name"
            variant="outlined"
            sx={{ width: "100%" }}
            required
            value={values.lastName}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, lastName: e.target.value }))
            }
          />
          <TextField
            id="outlined-basic"
            label="Age"
            variant="outlined"
            sx={{ width: "100%" }}
            required
            value={values.age}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, age: e.target.value }))
            }
          />
          <button type="submit" className="button">
            {update ? "Update student" : "Add student"}
          </button>
          <div>
            {fetching && <span className="loading">Fetching...</span>}
            {submiting && <span className="loading">Submiting...</span>}
            {deleting && <span className="loading">Deleting...</span>}
            {updating && <span className="loading">Updating...</span>}
          </div>
        </form>

        <div className="right">
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>First name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Last name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Age</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}></TableCell>
                  <TableCell sx={{ fontWeight: 700 }}></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {students?.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.firstName}</TableCell>
                    <TableCell>{item.lastName}</TableCell>
                    <TableCell>{item.age}</TableCell>
                    <TableCell
                      sx={{
                        color: "red",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onClick={() => deleteHandler(item.id)}
                    >
                      DELETE
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "blue",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onClick={() => changeHandler(item.id)}
                    >
                      CHANGE
                    </TableCell>
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

// export async function getStaticProps() {
//   const { students } = await graphcms.request(QUERY)

//   return {
//     props: {
//       students,
//     },
//   }
// }
