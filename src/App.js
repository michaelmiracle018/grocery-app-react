import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
	let list = localStorage.getItem("list");
	if (list) {
		return JSON.parse(localStorage.getItem("list"));
	}
	else {
		return []
	}
};

function App() {
	const [name, setName] = useState("");
	const [list, setList] = useState(getLocalStorage());
	const [isEditing, setIsEditing] = useState(false);
	const [editId, setEditId] = useState(null);
	const [alert, setAlert] = useState({
		show: false,
		msg: "",
		type: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!name) {
			// display alert
			showAlert(true, "danger", "please enter value");
		} else if (name && isEditing) {
			// deal with edit
			setList(
				list.map((item) => {
					if (item.id === editId) {
						return { ...item, title: name };
					}
					return item;
				}),
			);
			setName("");
			setEditId(null);
			setIsEditing(false);
			showAlert(true, "success", "value changed");
		} else {
			// show alerts
			showAlert(true, "success", "item added to the list");
			const newItem = { title: name, id: new Date().getTime().toString() };
			setList([...list, newItem]);
			setName("");
		}
	};

	const clearLIst = () => {
		showAlert(true, "danger", "empty list");
		setList([]);
	};

	const removeItem = (id) => {
		setAlert(true, "danger", "item removed from the list");
		setList(list.filter((item) => item.id !== id));
	};

	const editItem = (id) => {
		const specificItem = list.find((item) => item.id === id);
		setIsEditing(true);
		setEditId(id);
		setName(specificItem.title);
	};

	const showAlert = (show = false, type = "", msg = "") => {
		setAlert({ show, type, msg });
	};

	useEffect(() => {
		localStorage.setItem("list", JSON.stringify(list));
	}, [list]);

	return (
		<section className="section-center">
			<form onSubmit={handleSubmit} className="grocery-form">
				{alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
				<h3>grocery bud</h3>
				<div className="form-control">
					<input
						type="text"
						className="grocery"
						placeholder="eg. eggs"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<button type="submit" className="submit-btn">
						{isEditing ? "edit" : "submit"}
					</button>
				</div>
			</form>
			{list.length > 0 && (
				<div className="grocery-container">
					<List lists={list} removeItem={removeItem} editItem={editItem} />
					<button className="clear-btn" onClick={clearLIst}>
						Clear Items
					</button>
				</div>
			)}
		</section>
	);
}

export default App;
