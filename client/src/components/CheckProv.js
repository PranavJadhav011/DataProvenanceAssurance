import React,{useState} from 'react'
import './styles/CheckProv.css'
import { Button, Form } from 'react-bootstrap';
import { encode as base64_encode } from 'base-64';
require('dotenv').config()
const IPFS = require('ipfs-api');


let secrets = process.env.REACT_APP_INFURA_PROJECT_ID + ':' + process.env.REACT_APP_INFURA_PROJECT_SECRET;
let encodedSecrets = base64_encode(secrets);
const ipfs = new IPFS({
  host: 'ipfs.infura.io', port: 5001, protocol: 'https', headers: {
    Authorization: 'Basic ' + encodedSecrets
  }
});

export default function CheckProv() {
  const [buf, setBuf] = useState();
  const [hash, setHash] = useState("");
  const [loader, setLoader] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [name,changeName]=useState();
  const [valid,setValid]= useState();
  const [clicked,setClicked]= useState(false);

  const captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => convertToBuffer(reader)
  };

  const convertToBuffer = async (reader) => {
    const buffer = await Buffer.from(reader.result);
    setBuf(buffer);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    let ipfsId
    const buffer = buf
    await ipfs.add(buffer)
      .then((response) => {
        ipfsId = response[0].hash
        console.log("Generated IPFS Hash: ", ipfsId)
        setHash(ipfsId);
      }).catch((err) => {
        console.error(err)
        alert('An error occurred. Please check the console');
      })
    if (ipfsId)
      setShowLinks(true)
    else
      setShowLinks(false)
    setLoader(false);
  }

  let submitCheckProv = async (e)=>{
    e.preventDefault();
    setClicked(true);
    
    let result = await fetch("http://localhost:3500/searchHash",{
            method:'post',
            body:JSON.stringify({hash}),
            headers:{
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        // console.log(result);
        // if(result == hash ){
          if(result.hash == hash){
          setValid(true);
        }else{
          setValid(false);
        }
  }


  return (
    <div className='Check'>
        <h3>Check Validity of Data</h3>
        <br />
        <br />
        <Form onSubmit={onSubmit}>
          <h4>Add Edited/Original File</h4>
        <input type="file" onChange={captureFile} required />
        <br />
        <br />
        <Button type="submit">Upload</Button>
        <br />
        <br />
        {
        showLinks ?
          <div>
            Uploaded Successfully
          </div> :
          <p></p>
      }
      </Form>
        <Button className='btnn' onClick={submitCheckProv}>Check Validity</Button>
        {
          clicked?
          <>{
          valid?<h3>Data Not Modified and is Valid</h3> : <h3>Data has been Modified and is Invalid</h3>
          }
          </>:<></>
        }
    </div>
  )
}