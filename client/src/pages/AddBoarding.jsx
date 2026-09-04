import BoardingForm from '../components/BoardingForm';

function AddBoarding() {
  return (
    <main className="member-page content-width">
      <header className="member-page-header">
        <p className="eyebrow eyebrow-dark">List a property</p>
        <h1>Add a boarding place</h1>
        <p>Share the essentials students need to decide whether your place is right for them.</p>
      </header>
      <BoardingForm />
    </main>
  );
}

export default AddBoarding;
