import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';

type Post = {
  id: number;
  namaPaslon: string;
  visi: string;
  partaiPendukung: Array<number>;
};

const fetchData = async (): Promise<Post[]> => {
  const response = await axios.get<Post[]>('http://localhost:3000/posts');
  return response.data;
};

const deletePost = async (id: number) => {
  const response = await axios.delete(`http://localhost:3000/posts/${id}`);
  return response.data;
};

function App() {
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [username, setUsername] = useState('');
  const [result, setResult] = useState('');
  const [radioSelections, setRadioSelections] = useState<number[]>([0, 0, 0]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = parseInt(event.target.value, 10);
    setSelectedNumber(selectedValue);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const incrementNumber = () => {
    const newResult = `${username} memilih nomor ${selectedNumber + 1}\n${result}`;
    setResult(newResult);

    const updatedSelections = [...radioSelections];
    updatedSelections[selectedNumber]++;
    setRadioSelections(updatedSelections);
  };

  return (
    <div className="w-full h-screen p-10 flex bg-[#113946] ">
      <div className="w-[80%]">
        <div className="bg-white rounded-lg mr-10 mb-10 p-8 flex justify-between">
          <p className="text-4xl font-bold">Pemilihan Calon Ketua RT</p>
          <div className="w-[30%] justify-between flex">
            <Link to={'/add-paslon'} className="bg-[#113946] text-white py-2 px-4 rounded-md">
              Add Paslon
            </Link>
            <button className="bg-[#113946] text-white py-2 px-4 rounded-md">Login</button>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <Card />
        </div>
        <div className="flex gap-2 pr-10">
          <div className=" mt-10 bg-white w-[50%] rounded-lg">
            <div className="p-4 pb-0">
              <p className="font-bold">Total suara</p>
            </div>
            <div className="flex justify-between">
              <ResultCard value={radioSelections[0]} no={'Paslon 1'} />
              <ResultCard value={radioSelections[1]} no={'Paslon 2'} />
              <ResultCard value={radioSelections[2]} no={'Paslon 3'} />
            </div>
          </div>
          <div className="w-[50%] bg-white mt-10 rounded-lg p-4">
            <div className="items-center  ">
              <p className=" text-lg font-semibold">Tentukan suara anda</p>
              <div className="flex justify-between mt-4">
                <div>
                  <input type="radio" name="number" value="0" checked={selectedNumber === 0} onChange={handleRadioChange} />
                  <label className=" ml-2"> Paslon 1</label>
                </div>
                <div>
                  <input type="radio" name="number" value="1" checked={selectedNumber === 1} onChange={handleRadioChange} />
                  <label className=" ml-2">Paslon 2</label>
                </div>
                <div>
                  <input type="radio" name="number" value="2" checked={selectedNumber === 2} onChange={handleRadioChange} />
                  <label className="ml-2">Paslon 3</label>
                </div>
              </div>
            </div>
            <div className="flex justify-between w-full mt-4">
              <div>
                <label className="">Nama Lengkap: </label>
                <input type="text" value={username} onChange={handleUsernameChange} className="border-2 rounded-lg pl-1" />
              </div>
              <button onClick={incrementNumber} className=" bg-[#113946] px-8 rounded-lg text-white">
                Pilih
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[20%] bg-white rounded-lg h-full">
        <div className="p-6 w-full">
          <p className=" text-lg font-semibold">Hasil:</p>
          <pre className="pl-0 p-2 rounded-lg">{result}</pre>
        </div>
      </div>
    </div>
  );
}

function Card() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<Post[]>('posts', fetchData);

  const deleteMutation = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    },
  });

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div className="flex justify-between pr-10">
      {data?.map((post) => (
        <div key={post.id} className="flex flex-col justify-center items-center px-10 py-4 bg-white rounded-lg">
          <p className="text-4xl font-bold">{post.id}</p>
          <div className="w-[100px] h-[100px] my-2">
            <img src="../pp.jpg" alt="" />
          </div>
          <p className="font-bold">{post.namaPaslon}</p>
          <p className="text-sm">{post.visi}</p>
          <div className="text-sm mt-4 items-start">
            <p className="font-bold">Partai Pendukung :</p>
            <p>{post.partaiPendukung[0]}</p>
            <p>{post.partaiPendukung[1]}</p>
            <p>{post.partaiPendukung[2]}</p>
          </div>

          <div className="w-[100%] justify-between flex gap-2 mt-4">
            <button onClick={() => handleDelete(post.id)} className="bg-[#113946] text-white py-2 px-4 rounded-md">
              Delete
            </button>
            
            <Link to={'/update-paslon/:id'} className="bg-[#113946] text-white py-2 px-4 rounded-md">Update</Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResultCard({ value, no }: { value: number; no: string }) {
  return (
    <div className="flex flex-col justify-center items-center p-4">
      <p>{no}</p>
      <p>{value}</p>
    </div>
  );
}

export default App;
