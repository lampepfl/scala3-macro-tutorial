lazy val website = project
  .in(file("mdoc"))
  .settings(
    skip.in(publish) := true
  )
  .enablePlugins(DocusaurusPlugin)