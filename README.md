# 🚀 Welcome to MyStudy

This is an application for Android, iOS and Windows aimed at a student audience that seeks to facilitate the client's school organization.

## 📸 ScreenShots

![Screenshot](https://via.placeholder.com/800x400)

## 🔧 TechStack

- 🧩 Framework: React Native & Expo
- 🎨 Styles: CSS & TailwindCSS
- 🔙 Backend: Node.js
<!-- - 🛢️ Database:  -->

## 📃 Licence

This project is licensed under the [Licencia MIT](LICENSE).

## 🧭 Project Structure

```bash
/
  /api
  /app
    /(drawer)       → All the pages
  /assets           → Images and other resources
    /background
    /fonts
    /icons
    /images
  /components       → Reusable components (react)
  /constants        → Global types and default values
  /styles           → Global styles

```

## 🤝 Contact Info

- Name : [Víctor Fernández](https://github.com/vfernandez24/)
- Email : [germanfernandezblanco@gmail.com](mailto:germanfernandezblanco@gmail.com)

## 🧪 Important Scripts

```bash
npm run start
npm run clear
npm run build
```

## 📦 Installation

Clone this repo and follow these steps:

```bash
git clone https://github.com/vfernandez24/MyStudy.git
cd MyStudy
npm install
npm run dev
```

# Dev notes

## To get the data

1. First you create a constant named like de data

```js
const [data, setData] = useState<data[]>(defaultData); // DefaultData => To develop
```

2. Next you get the data from the localStorage and change the value of the constant

```js
// Element = data to get; you must change it to the data you want
useEffect(() => {
  const loadData = async () => {
    const elementsAwait = await AsyncStorage.getItem("element");
    const parsedElements: subject[] = elementsAwait
      ? JSON.parse(elementsAwait)
      : defaultElements;
    setElements(parsedElements);
    saveData("subjects", JSON.stringify(parsedElements));
  };
  loadData();
}, []);
```
