document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('userForm');
    const result = document.getElementById('result');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nama = document.getElementById('nama').value;
        const kelas = document.getElementById('kelas').value;
        const sekolah = document.getElementById('sekolah').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;

        const data = {
            nama,
            kelas,
            sekolah,
            gender
        };

        try {
            //Replace this with your API Gateway URL
            const response = await fetch('https://gvkamlftq3.execute-api.us-west-2.amazonaws.com/dev/app1', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const resultData = await response.json();
            result.innerText = resultData.body || 'Data berhasil dikirim.';
        } catch (error) {
            result.innerText = 'Terjadi kesalahan saat mengirim data.';
            console.error('Error:', error);
        }
    });

    async function fetchData() {
        try {
            const response = await fetch('https://gvkamlftq3.execute-api.us-west-2.amazonaws.com/dev/app1'); // Ganti dengan GET endpoint
            const dataList = await response.json();
            //const dataList = JSON.parse(raw.body);

            // Kosongkan isi tabel
            dataTable.innerHTML = '';

            // Tampilkan data baru
            dataList.forEach(data => {
                const row = dataTable.insertRow();
                row.insertCell(0).innerText = data.nama;
                row.insertCell(1).innerText = data.kelas;
                row.insertCell(2).innerText = data.sekolah;
                row.insertCell(3).innerText = data.gender;
            });
        } catch (error) {
            console.error('Gagal mengambil data:', error);
            return error;
        }
    }

    // Ambil data saat halaman pertama kali dimuat
    fetchData();
});
