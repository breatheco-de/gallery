import React, { useEffect, useState } from "react";
import { Widget } from "@uploadcare/react-widget";
import Select from "react-select";
//create your first component
const HOST = process.env.ASSETS_URL || "https://assets.breatheco.de/";
const defaultImg = {
	uuid: null,
	description: "",
	url: "",
	category: null,
	tags: ""
};
export function Home() {
	const [start, setStart] = useState(0);
	const [images, setImages] = useState([]);
	const [categories, setCategories] = useState([]);
	const [tags, setTags] = useState([]);
	const [filterTags, setFilterTags] = useState([]);
	const [filterCategories, setFilterCategories] = useState([]);
	const [widgetStep, setWidgetStep] = useState(0);
	const [pictureData, setPictureData] = useState(defaultImg);
	useEffect(() => {
		fetch(HOST + "apis/static/image/all?start=" + start)
			.then(resp => resp.json())
			.then(data => setImages(data))
			.catch(err => console.error(err));
		fetch(HOST + "apis/static/image/categories")
			.then(resp => resp.json())
			.then(data => setCategories(data))
			.catch(err => console.error(err));
		fetch(HOST + "apis/static/image/tags")
			.then(resp => resp.json())
			.then(data => setTags(data))
			.catch(err => console.error(err));
	}, []);
	return (
		<div className="container">
			{widgetStep === 0 ? (
				<button
					className="btn btn-light my-2 form-control"
					onClick={() => setWidgetStep(1)}>
					<i className="fas fa-plus-circle" />
					Add new picture
				</button>
			) : widgetStep == 1 ? (
				<div className="p-3 upload">
					<label htmlFor="file">Pick your file</label>{" "}
					<Widget
						className="form-control"
						previewStep={true}
						publicKey={"87bbef8b86f6973ccade"}
						onFileSelect={file => {
							console.log("File changed: ", file);

							if (file) {
								file.progress(info =>
									console.log(
										"File progress: ",
										info.progress
									)
								);
								file.done(info => {
									console.log("Image uploded", info);
									setPictureData({
										...pictureData,
										uuid: info.uuid,
										url: info.cdnUrl
									});
									fetch(
										HOST +
											"apis/static/image/upload/" +
											info.uuid,
										{
											method: "POST"
										}
									)
										.then(resp => resp.json())
										.catch(
											err =>
												console.error(err) ||
												alert(
													"There was an error uploading the image"
												)
										);
								});
							}
						}}
						onChange={info =>
							console.log("Upload completed:", info)
						}
					/>
					<div>
						<div className="row my-2">
							<div className="col">
								<input
									type="text"
									placeholder="What is this file about?"
									className="form-control"
									onChange={e =>
										setPictureData({
											...pictureData,
											description: e.target.value
										})
									}
									value={pictureData.description}
								/>
							</div>
						</div>
						<div className="row mb-2">
							<div className="col">
								<Select
									placeholder="Select one categoy"
									value={pictureData.category}
									onChange={value =>
										setPictureData({
											...pictureData,
											category: value
										})
									}
									options={categories.map(cat => ({
										value: cat,
										label: cat
									}))}
								/>
							</div>
						</div>
						<div className="row mb-2">
							<div className="col">
								<Select
									isMulti
									placeholder="Add some tags"
									value={pictureData.tags}
									onChange={values =>
										setPictureData({
											...pictureData,
											tags: values
										})
									}
									options={tags.map(t => ({
										value: t,
										label: t
									}))}
								/>
							</div>
						</div>
						<button
							className="btn btn-primary form-control"
							onClick={() => {
								fetch(
									HOST +
										"apis/static/image",
									{
										method: "POST",
										headers: {
											"Content-Type": "application/json"
										},
										body: JSON.stringify({
											...pictureData,
											category:
												pictureData.category.value,
											tags: pictureData.tags
												.map(t => t.value)
												.join(",")
										})
									}
								)
									.then(resp => resp.json())
									.then(newImg => {
										setImages(
											[newImg[pictureData.uuid]].concat(
												images
											)
										);
										setPictureData(defaultImg);
										setWidgetStep(0);
									})
									.catch(
										err =>
											console.error(err) ||
											alert(
												"There was an error uploading the image"
											)
									);
							}}>
							Save
						</button>
					</div>
				</div>
			) : (
				""
			)}
			<div className="row mb-2">
				<div className="col-6">
					<Select
						isMulti
						placeholder="Select one or more categories"
						value={filterCategories}
						onChange={value => setFilterCategories(value)}
						options={categories.map(cat => ({
							value: cat,
							label: cat
						}))}
					/>
				</div>
				<div className="col-6">
					<Select
						placeholder="Select one or more tags"
						value={filterTags}
						onChange={value => setFilterTags(value)}
						options={tags.map(cat => ({
							value: cat,
							label: cat
						}))}
					/>
				</div>
			</div>
			<div className="gallery card-columns">
				{images
					.filter(i => {
						if (filterCategories.length > 0) {
							if (
								filterCategories
									.map(c => c.value || c)
									.includes(i.category)
							)
								return true;
							else return false;
						}
						return true;
					})
					.map(img => (
						<div key={img.uuid} className="card">
							<div
								className="card-img-top w-100"
								style={{
									backgroundImage: `url('${img.url}')`,
									height: "250px"
								}}>
								<ul className="icons">
									<li
										className="pointer"
										onClick={e => {
											const _delete = window.confirm(
												"Are you sure you want to delete this image"
											);
											if (_delete)
												fetch(
													HOST +
														"apis/static/image/" +
														img.uuid,
													{
														method: "DELETE"
													}
												)
													.then(resp => {
														if (resp.status === 200)
															setImages(
																images.filter(
																	i =>
																		i.uuid !==
																		img.uuid
																)
															);
														return resp.json();
													})
													.catch(
														err =>
															console.error(
																err
															) ||
															alert(
																"There was an error deleting the image"
															)
													);
										}}>
										<i className="fas fa-trash" />
									</li>
									<li
										className="pointer"
										onClick={e => window.open(img.url)}>
										<i className="fas fa-external-link-alt" />
									</li>
								</ul>
							</div>
							<div className="card-block p-2">
								<p className="card-text">{img.description}</p>
								<h5 className="card-title">{img.category}</h5>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
