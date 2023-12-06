import { useState } from 'react';
import './styles/AddFile.css';
import { Button, Form } from 'react-bootstrap';
import Loader from './Loader';
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


function AddFile() {
  const [buf, setBuf] = useState();
  const [hash, setHash] = useState("");
  const [loader, setLoader] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [name,changeName]=useState();

  const captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    changeName(event.target.files[0].name);
    // console.log(name);
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => convertToBuffer(reader)
  };

  const convertToBuffer = async (reader) => {
    const buffer = await Buffer.from(reader.result);
    setBuf(buffer);
  };

  // let changeNameFunc =(e)=>{
  //   changeName(e.target.value);
  //   // changeName(e.target.files[0].name);
  //   // console.log(name);
  // }

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    let ipfsId
    const buffer = buf
    await ipfs.add(buffer).then((response) => {
        ipfsId = response[0].hash
        console.log("Generated IPFS Hash: ", ipfsId)
        setHash(ipfsId);
      }).catch((err) => {
        console.error(err)
        alert('An error occurred. Please check the console');
      })
      console.log(name);
      console.log(hash);
      console.log(ipfsId);
      
      let result = await fetch('http://localhost:3500/addHash', {
        method: 'post',
        body: JSON.stringify({name,hash}),
        headers: {
          'Content-Type': 'application/json'
        },
      })
      result = await result.json();
      console.log(result);

    if (ipfsId)
      setShowLinks(true)
    else
      setShowLinks(false)
    setLoader(false);
  }

  if (loader) {
    return (
      <Loader />
    )
  }


  return (
    <div className='fileAdd'>
      <h3>Upload files to IPFS</h3>
      <h5> Choose file to upload to IPFS </h5>
      <br />
      <Form onSubmit={onSubmit}>
        {/* <input type="text" onChange={changeNameFunc} placeholder='Enter the Name of the file' required/>
        <br />
        <br /> */}
        <input type="file" onChange={captureFile} required />
        <br />
        <br />
        <Button  type="submit">Upload</Button>
        <br />
        <br />
      </Form>
      {
        showLinks ?
          <div>
            <p>---------------------------------------------------------------------------------------------</p>
            <h6>IPFS Hash: {hash}</h6>
            <p>Non clickabe Link: https://ipfs.io/ipfs/{hash}</p>
            <a href={"https://ipfs.io/ipfs/" + hash}>Clickable Link to view file on IPFS</a>
          </div> :
          <p></p>
      }
    </div>
  );
}

export default AddFile;
