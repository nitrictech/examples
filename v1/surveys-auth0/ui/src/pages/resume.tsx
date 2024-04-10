import Header from '../components/Header'
import Footer from '../components/Footer'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { callApi } from '../services/apiClient'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Resume() {
  const [savedRows, setSavedRows] = useState([])
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    const runPrefillEvent = async () => {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/submissions/${user.email}`
      const response = await callApi(url, {
        method: 'GET',
      })

      const success = response.status === 200 || response.status === 201
      if (success) {
        const data = await response.json()
        console.log(data.output)

        if (data?.output?.length == 0) {
          console.log('No saved forms found')
          router.push(`/survey`)
        }
        console.log(`${data.output.length} saved forms found`)
        setSavedRows(data.output)
      } else {
        console.log('No saved forms found')
        router.push(`/survey`)
      }
    }
    runPrefillEvent()
  }, [])

  const handleStartNew = () => {
    router.push(`/survey`)
  }

  const handleButtonClick = (rowData) => {
    console.log(`Resuming with submission:${rowData.id}`)
    router.push(`/survey?submission=${rowData.id}`)
  }

  if (isLoading) {
    return <h1>loading....</h1>
  }
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
            <div className="space-y-12 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Resume a previously saved form?
              </h2>
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Submission ID
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                        >
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedRows?.map((row, rowIndex) => (
                        <tr key={row.id}>
                          <td
                            className={classNames(
                              rowIndex === 0
                                ? ''
                                : 'border-t border-transparent',
                              'relative py-4 pl-4 pr-3 text-sm sm:pl-6'
                            )}
                          >
                            <div className="font-medium text-gray-900">
                              {row.id}
                            </div>
                            {rowIndex !== 0 ? (
                              <div className="absolute -top-px left-6 right-0 h-px bg-gray-200" />
                            ) : null}
                          </td>
                          <td
                            className={classNames(
                              rowIndex === 0 ? '' : 'border-t border-gray-200',
                              'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
                            )}
                          >
                            {row.email}
                          </td>

                          <td
                            className={classNames(
                              rowIndex === 0
                                ? ''
                                : 'border-t border-transparent',
                              'relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'
                            )}
                          >
                            <button
                              type="button"
                              onClick={() => handleButtonClick(row)}
                              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                            >
                              Resume
                            </button>
                            {rowIndex !== 0 ? (
                              <div className="absolute -top-px left-0 right-6 h-px bg-gray-200" />
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  onClick={handleStartNew}
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Start over
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
export default withPageAuthRequired(Resume)
