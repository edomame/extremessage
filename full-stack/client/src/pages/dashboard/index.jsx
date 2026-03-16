const Dashboard = () => {
  return (
    // <div className="h-screen flex">
    // <div className="h-screen grid grid-cols-[1fr_2fr_1fr]">
    //     <div className="bg-red-200 border-r">
    //         <h1>Dashboard</h1>
    //         <p>You are logged in.</p>
    //         Left panel
    //     </div>

    //     <div className="bg-green-200 border-r">
    //         Center section
    //     </div>

    //     <div className="bg-blue-200">
    //         Right panel
    //     </div>
    // </div>
    <div className="h-screen flex">
        <div className="w-1/4 flex flex-col bg-red-200 border-r">
            <div className="p-2 bg-red-400">
                <b>Extremessage Dashboard</b>
                <p>You are logged in.</p>
            </div>
            <div className="p-2 flex-1 overflow-auto">
                Left panel
            </div>
        </div>

        <div className="w-1/2 bg-green-200 border-r">
            Center section
        </div>

        <div className="w-1/4 bg-blue-200">
            Right panel
        </div>
    </div>
  );
};

export default Dashboard;