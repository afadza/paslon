import { useMutation } from 'react-query';
import axios from 'axios';

const UpdatePaslon = () => {
  const addPaslonMutation = useMutation((newPaslonData) => axios.post('http://localhost:3000/posts/:id', newPaslonData));

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newPaslonData = {
      namaPaslon: formData.get('namaPaslon'),
      visi: formData.get('visi'),
      partaiPendukung: Array.from(formData.getAll('partaiPendukung')),
    };

    addPaslonMutation.mutate(newPaslonData);
  };

  return (
    <div className="w-full h-screen bg-[#113946] flex justify-center items-center">
      <div className="bg-white p-8 w-[20%] rounded-lg">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="" className="w-full font-bold">
              Nama Paslon
              <input type="text" name="namaPaslon" value={namaPaslon} className="border-2 w-full rounded-lg" />
            </label>
          </div>
          <div className="mb-4">
            <label htmlFor="" className="w-full font-bold">
              Visi
              <input type="text" name="visi" className="border-2 w-full rounded-lg" />
            </label>
          </div>
          <div className="mb-4">
            <label htmlFor="" className="w-full font-bold">
              Partai Pendukung
            </label>
            <div className="flex flex-col">
              <label htmlFor="">
                <input type="checkbox" name="partaiPendukung" value="Partai 1" />
                Partai 1
              </label>
              <label htmlFor="">
                <input type="checkbox" name="partaiPendukung" value="Partai 2" />
                Partai 2
              </label>
              <label htmlFor="">
                <input type="checkbox" name="partaiPendukung" value="Partai 3" />
                Partai 3
              </label>
            </div>
          </div>
          <div>
            <button type='submit' className="bg-[#113946] w-full py-2 px-4 text-white rounded-lg" disabled={addPaslonMutation.isLoading}>
              {addPaslonMutation.isLoading ? 'Menambahkan...' : 'Tambah'}
            </button>
          </div>
        </form>
        {addPaslonMutation.isError && <div className="text-red-600 mt-2">Terjadi kesalahan saat menambahkan paslon.</div>}
        {addPaslonMutation.isSuccess && <div className="text-green-600 mt-2">Paslon berhasil ditambahkan!</div>}
      </div>
    </div>
  );
};

export default UpdatePaslon;
