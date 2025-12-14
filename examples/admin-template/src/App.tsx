import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/Home';
import GuidePage from './pages/Guide';
import FormExamplePage from './pages/examples/FormExample';
import TableExamplePage from './pages/examples/TableExample';
import RequestExamplePage from './pages/examples/RequestExample';
import LoadingExamplePage from './pages/examples/LoadingExample';
import RichTextExamplePage from './pages/examples/RichTextExample';
import DialogExamplePage from './pages/examples/DialogExample';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="guide" element={<GuidePage />} />
        <Route path="examples">
          <Route path="form" element={<FormExamplePage />} />
          <Route path="table" element={<TableExamplePage />} />
          <Route path="request" element={<RequestExamplePage />} />
          <Route path="loading" element={<LoadingExamplePage />} />
          <Route path="richtext" element={<RichTextExamplePage />} />
          <Route path="dialog" element={<DialogExamplePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

