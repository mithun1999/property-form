import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap'
import Base from '../Core/Base'
import './Home.css'
import { CSVReader } from 'react-papaparse'
import { useDropzone } from 'react-dropzone';
import Stepper from 'react-stepper-horizontal'
import { Formik } from "formik";
import * as Yup from "yup";


function Home2() {


    const [values, setValues] = useState({
        address: '',
        bedroom: '',
        bathroom: '',
        description: '',
        error: '',
        showTable: false,
        featuredImg: '',
        showCsvUpload: false
    })

    const [currentStep, setCurrentStep] = useState(0)

    const [files, setFiles] = useState([]);


    const { address, bedroom, bathroom, description, error, showTable, featuredImg, showCsvUpload } = values


    const handleError = (err, file, inputElem, reason) => {
        setValues({ ...values, error: err })
    }

    const handleDrop = (incomeData) => {
        const parsedData = incomeData[0].data
        setValues({
            ...values,
            address: parsedData[0],
            bedroom: parsedData[1],
            bathroom: parsedData[2],
            description: parsedData[3]
        })
        setCurrentStep(step => step + 1)
    }


    const handleShowCsv = () => {
        setValues({ ...values, showCsvUpload: true })
    }

    const handleStep = () => {
        setCurrentStep(step => step + 1)
    }

    const handleRadio = (event) => {
        setValues({ ...values, featuredImg: event.target.value })
    }



    const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        maxFiles: 4,
        onDrop: acceptedFiles => {
            acceptedFiles.map(files => {
                const reader = new FileReader()
                reader.onload = (event) => {
                    setFiles(prev => {
                        const updatedImgs = [...prev, {
                            ...files,
                            preview: URL.createObjectURL(files),
                            base64img: event.target.result
                        }]
                        return updatedImgs
                    })
                }
                reader.readAsDataURL(files)
            })
            setValues({ ...values, showTable: true })
        }
    });

    const thumbs = files.map(file => (
        <tr key={file.path}>
            <td>
                <input type="radio" name="featuredimg" value={file.base64img} onChange={handleRadio} />
            </td>
            <td>
                <img src={file.preview} className="img-responsive mx-auto custom-img" />
            </td>
        </tr>
    ));

    const initialValues = {
        address: address,
        bedrooms: bedroom,
        bathrooms: bathroom,
        description: description,
    };

    const schema = Yup.object({
        address: Yup.string().required("* Address is required"),
        bedrooms: Yup.string().required("* Bedrooms is required").max(10, "* Only 10 characters are allowed"),
        bathrooms: Yup.string().required("* Bathrooms is required").max(5, "* Only 5 characters are allowed"),
    });

    const handleSubmit = (data) => {
        setValues({
            ...values,
            address: data.address,
            bathroom: data.bathrooms,
            bedroom: data.bedrooms,
            description: data.description
        })
        setCurrentStep(step => step + 1)
    };

    const handleFinalSubmit = () => {
        console.log('-----------')
        console.log({
            address: address,
            bedrooms: bedroom,
            bathrooms: bathroom,
            description: description,
            featuredImage: featuredImg,
            files: files
        })
        console.log('-----------')
    }


    const step1 = (
        <div className="mt-4">
            <Row className="justify-content-md-center">
                <Col md="2">
                    <button className="btn-grad" onClick={handleStep}>Scratch</button>
                </Col>
                <Col md="2">
                    <button className="btn-grad" onClick={handleShowCsv}>CSV</button>
                </Col>
            </Row>

            <Row className="justify-content-md-center mt-4">
                <Col md="6">
                    {showCsvUpload && (
                        <CSVReader
                            onDrop={handleDrop}
                            onError={handleError}
                        >
                            <span>Drop CSV file here or click to upload.</span>
                        </CSVReader>
                    )}

                </Col>
            </Row>
        </div>
    )

    const step2 = (
        <div className="mt-4">
            <Row className="justify-content-md-center">
                <Col md="10">
                    <Formik
                        validationSchema={schema}
                        onSubmit={handleSubmit}
                        initialValues={initialValues}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            values,
                            errors,
                        }) => (
                                <Row className="justify-content-md-center mt-4">
                                    <Col md="8">
                                        <Form noValidate onSubmit={handleSubmit}>
                                            <Form.Group controlId="validationFormikUsername">
                                                <Form.Label>Address</Form.Label>

                                                <InputGroup>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Address"
                                                        name="address"
                                                        value={values.address}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.address}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.address}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                            <Form.Group controlId="validationFormik03">
                                                <Form.Label>Bedrooms</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Number of Bedrooms"
                                                    name="bedrooms"
                                                    value={values.bedrooms}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.bedrooms}
                                                />

                                                <Form.Control.Feedback type="invalid">
                                                    {errors.bedrooms}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group controlId="validationFormik04">
                                                <Form.Label>Bathrooms</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Number of Bathrooms"
                                                    name="bathrooms"
                                                    value={values.bathrooms}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.bathrooms}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.bathrooms}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group controlId="validationFormik05">
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control
                                                    as="textarea" rows={3}
                                                    placeholder="Description"
                                                    name="description"
                                                    value={values.description}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                            <button type="submit" className="btn btn-grad">Next</button>
                                        </Form>
                                    </Col>
                                </Row>
                            )}
                    </Formik>
                </Col>
            </Row>
        </div>
    )

    const step3 = (
        <div className="mt-4">
            <Row className="justify-content-md-center">
                <Col md="8">
                    <div className="drop-box">
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                            <p>* Only 4 images are allowed</p>
                        </div>
                    </div>
                    {Array.isArray(fileRejections) && fileRejections.length !== 0 && (
                        <p className="alert alert-danger mt-2">* Only 4 images are allowed</p>
                    )}

                </Col>
            </Row>

            <Row className="justify-content-md-center">
                <Col md="8">
                    {showTable && (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Select</th>
                                    <th scope="col">Images</th>
                                </tr>
                            </thead>
                            <tbody>
                                {thumbs}
                            </tbody>
                        </table>
                    )}
                </Col>
            </Row>

            <Row className="justify-content-md-center">
                <Col md="8">
                    <button className="btn btn-grad mt-3 mb-3" onClick={handleFinalSubmit}>Submit</button>
                </Col>
            </Row>
        </div>
    )



    const renderSwitch = (step) => {
        switch (step) {
            case 0:
                return step1
            case 1:
                return step2
            case 2:
                return step3
            default:
                return ''

        }
    }

    const steps = [
        {
            title: "Step 1"
        },
        {
            title: "Step 2"
        },
        {
            title: "Step 3"
        }
    ]

    useEffect(() => () => {
        // Revoking the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);


    return (
        <Base title="Property Form">

            <Container className="mb-5">
                <Row className="justify-content-md-center">
                    <Col md="10">
                        <Stepper steps={steps} activeStep={currentStep} />
                    </Col>
                </Row>
                {renderSwitch(currentStep)}
            </Container>

        </Base>
    )
}

export default Home2;