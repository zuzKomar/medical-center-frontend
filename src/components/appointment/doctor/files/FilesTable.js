import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {baseUrl} from "../../../../config/config";
import {Table} from "@material-ui/core";


const FilesTable = () => {

    const [files, setFiles] = useState([]);
    let history = useHistory();
    const patient = history.location.state;

    useEffect(() => {
        const getFiles = async () => {
            const files = await fetchFiles()
            setFiles(files)
        }
        getFiles();
    }, [])

    const fetchFiles = async () => {
        const res = await fetch(`${baseUrl}/patients/${patient.id}/files`);
        return await res.json();
    }

    let i = 1;
    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Patient's files</h2>
            </div>
            <div className="newAppointmentForm">
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th/>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Date Added</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {files.map(file =>
                        <tr>
                            <td>{i++}</td>
                            <td>{file.name}</td>
                            <td>{file.description}</td>
                            <td/>
                            <td><button className="actionButton">VIEW</button></td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default FilesTable;