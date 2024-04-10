import Form from '../components/Form'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Head from 'next/head'

function SurveyForm() {
  return (
    <>
      <Head>
        <title>Survey Form.</title>
        <meta name="description" content="Fill out the questionnaire." />
      </Head>
      <Header />
      <main>
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-8 lg:px-8">
            <Form />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
export default SurveyForm
