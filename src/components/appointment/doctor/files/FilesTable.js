import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {baseUrl} from "../../../../config/config";
import {Table} from "@material-ui/core";
import Button from "react-bootstrap/Button";
import AppointmentDetailsButtonPanel from "../AppointmentDetailsButtonPanel";

const FilesTable = ({t}) => {

    const [files, setFiles] = useState([]);
    let history = useHistory();
    const appointment = history.location.state;

    useEffect(() => {
        const getFiles = async () => {
            const files = await fetchFiles()
            setFiles(files)
        }
        getFiles();
    }, [])

    const fetchFiles = async () => {
        const res = await fetch(`${baseUrl}/patients/${appointment.patient.id}/files`);
        return await res.json();
    }

    const handleFileDownload = (e, file) => {
        e.preventDefault();
        fetch(`${baseUrl}/patients/${appointment.patient.id}/files/${file.id}`)
            .then(res => res.json())
            .then(res => {
                let a = window.document.createElement('a');
                let byteArr = new Uint8Array(res.file);
                a.href = window.URL.createObjectURL(new Blob([byteArr], {type: file.type}))
                a.download = res.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
    }

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>{t("patientFiles")}</h2>
            </div>
            <AppointmentDetailsButtonPanel appointment={appointment} t={t} />
            {files.length > 0 ?
                <Table className="table table-hover table-bordered fileTable topBuffer" style={{width : '80%'}}>
                    <thead style={{backgroundColor : '#e6eeff'}}>
                    <tr>
                        <th>{t("name")}:</th>
                        <th>{t("description")}:</th>
                        <th>{t("createDate")}</th>
                        <th>{t("action")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {files.map((file)=>
                        <tr key={file.id}>
                            <td>{file.name}</td>
                            <td>{file.description}</td>
                            <td>{file.uploadDate}</td>
                            <td>
                                <Button variant='primary' onClick={e => handleFileDownload(e, file)}>Download</Button>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table> : <span className="topBuffer">No files to show</span>
            }
        </div>
    )
}

export default FilesTable;