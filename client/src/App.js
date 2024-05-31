import './App.css';
import {useState} from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'

// const MySwal = withReactContent(Swal)

function App() {

  const [nombre, setNombre ] = useState('')
  const [edad, setEdad ] = useState(0)
  const [pais, setPais ] = useState('')
  const [cargo, setCargo ] = useState('')
  const [anios, setAnios ] = useState(0)
  const [empleadoList, setEmpleados ] = useState([])
  const [id, setId ] = useState(0)
  const [editar, setEditar ] = useState(false)

  const limpiarCampos = () =>{
    setNombre("")
    setEdad(0)
    setPais("")
    setCargo("")
    setAnios(0)
    setId(0)
    setEditar(false)
  }
  
  const add = () =>{
    axios.post('http://localhost:3002/create', {
      nombre:nombre,
      edad:edad,
      pais:pais,
      cargo:cargo,
      anios:anios
    }).then(()=>{
      limpiarCampos()
      getEmpleados()

     Swal.fire({
        title: "Registro exitoso",
        html: `<i>Empleado ${nombre} fue registrado</i>`,
        icon: "success"
      });
    })
  }

  const editarEmpleado = (val) => {
    setEditar(true)

    setNombre(val.nombre)
    setEdad(val.edad)
    setPais(val.pais)
    setCargo(val.cargo)
    setAnios(val.anios)
    setId(val.id)
  }

  const update = () =>{
    axios.put('http://localhost:3002/update', {
      id:id,  
      nombre:nombre,
      edad:edad,
      pais:pais,
      cargo:cargo,
      anios:anios
    }).then(()=>{
      limpiarCampos()
      getEmpleados()

      Swal.fire({
        title: "Registro exitoso",
        html: `<i>Empleado ${nombre} fue actualizado</i>`,
        icon: "success",
        time: 2000
      });
    })
  }

  const deleteEmpleado = (val) =>{

      Swal.fire({
        title: "Confirmar Elimacion ?",
        html: `<i>Empleado ${val.nombre} fue eliminado</i>`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminarlo!"
      }).then((result) => {
        if (result.isConfirmed) {
          
          axios.delete(`http://localhost:3002/delete/${val.id}`).then(()=>{
            limpiarCampos()
            getEmpleados()

            Swal.fire({
              title: "Deleted!",
              text: "registro Eliminado.",
              icon: "success",
              showConfirmButton: false,
              timer: 2000
            });
          }).catch(error => {
            Swal.fire({
              icon: "error",
              title: "Oops...!",
              text: "No se logro eliminar empleado.",
              footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Error de Servidor" : JSON.parse(JSON.stringify(error)).message
            }) 
          })
        }
      });
  }

  const getEmpleados = () =>{
    axios.get('http://localhost:3002/empleados')
    .then((response)=>{
      setEmpleados(response.data)
    })
  }

  getEmpleados()

  return (
    <div className="container">

      <div className="card text-center">
        <div className="card-header">
          Gestion de Empleados
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Nombre:</span>
            <input type="text" value={nombre} onChange={(event)=>{setNombre(event.target.value)}} className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Edad:</span>
            <input type="text" value={edad} onChange={(event)=>{setEdad(event.target.value)}} className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Pais:</span>
            <input type="text" value={pais} onChange={(event)=>{setPais(event.target.value)}} className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Cargo:</span>
            <input type="text" value={cargo} onChange={(event)=>{setCargo(event.target.value)}} className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Años:</span>
            <input type="text" value={anios} onChange={(event)=>{setAnios(event.target.value)}} className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
          </div>
        </div>
        <div className="card-footer text-body-secondary">
          {
            editar 
            ? 
            <div>
              <button className="btn btn-warning m-2" onClick={update}>Editar</button> 
              <button className="btn btn-info m-2" onClick={limpiarCampos}>Cancelar</button> 
            </div>
            :
              <button className="btn btn-success" onClick={add}>Enviar Datos</button>
          }
          
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
            <th scope="col">Pais</th>
            <th scope="col">Cargo</th>
            <th scope="col">Experiencia</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            // empleadoList.map((val, key) => {
            //   return <div>{val.nombre}</div>
            // })
            empleadoList.map((val, i) => (
              <tr key = {i}>
                <th scope="row">{val.id}</th>
                <td>{val.nombre}</td>
                <td>{val.edad}</td>
                <td>{val.pais}</td>
                <td>{val.cargo}</td>
                <td>{val.anios}</td>
                <td>
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" onClick={ ()=>{ editarEmpleado(val) }} className="btn btn-info">Editar</button>
                    <button type="button" onClick={ ()=>{deleteEmpleado(val) }} className="btn btn-danger">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
    
  );
}

export default App;
