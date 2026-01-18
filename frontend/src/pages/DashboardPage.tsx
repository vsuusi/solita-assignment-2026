import MainTable from "../components/MainTable";

function DashboardPage() {
  return (
    <div data-testid="dashboard-page">
      <h1>Daily electricity statistics</h1>
      <MainTable />
    </div>
  );
}

export default DashboardPage;
