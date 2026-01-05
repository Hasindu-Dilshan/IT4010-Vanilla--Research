import React, { useEffect, useState } from "react";
import "./container.css";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineFileImage } from "react-icons/ai";
import FilterGroup from "../fillters/FilterGroup";
import Notiflix from "notiflix";
import UsersService from "../../services/Users.service";
import { useDropzone } from "react-dropzone";
import { vars } from '../../environment/variables';

function FlowerContainer() {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [result, setResult] = useState(null);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const openPreview = () => {
        setIsPreviewOpen(true);
    };

    const closePreview = () => {
        setIsPreviewOpen(false);
    };

    const links = [
        { to: '/quality', name: 'Flower Detection' }
    ];

    const loadData = async () => {

    }



    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                setSelected(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                handleFileUpload(file);
                reader.readAsDataURL(file);
            }
        }
    });

    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(vars.ML_URL + '/predict-flower', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData)

                setResult(responseData.prediction)
            } else {
                // Handle error response
                const errorData = await response.json();
                console.error(errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="cards">
            <div className="filters">
                <div className="popular">
                    <h2>Flower Detection Section</h2>
                </div>
                <FilterGroup links={links} />
            </div>

            <main>
                <div className="sect-search"></div>

                <div className="sect-list">
                    <div className="upload-area" {...getRootProps()}>
                        <input {...getInputProps()} />
                        {imagePreview ? (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Preview" />
                            </div>
                        ) : (
                            <div className="image-preview">
                                <div className="up-msg">
                                    <h4>Uplad or Drop Image HERE</h4>
                                    <br></br>
                                    <AiOutlineFileImage className="icon"/>
                                </div>

                            </div>
                        )}

                    </div>
                    <div className="results-area">
                        {imagePreview&&<span className="topic">Results</span>}
                        <br></br>
                        {imagePreview && <button className="submit-button" onClick={openPreview}>Open Preview</button>}
                        {
                            result && <>
                                <br></br><br></br>
                                <p>PREDICTED RESULT: {result}</p>

                            </>
                        }
                        {/* <img src={process.env.PUBLIC_URL + '/ml/uploads/aaa.png'} alt="Marked Image" /> */}
                    </div>
                </div>
            </main>


        </div>
    );
}

const Icon = ({ icon }) => (
    <li>
        <a>{icon}</a>
    </li>
);

export default FlowerContainer;
