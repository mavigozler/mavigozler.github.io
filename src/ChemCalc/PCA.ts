
/***********************************************************
      <!--  Principal Components Analysis --->
 ***********************************************************/
/* insert eslint DISABLING for compiled JS here */
// This is an example function from NAG Data Mining

// constructor for a PCA complete analysis object
function PCAset(dataBlock, countRec, countVar, rec1, countConsecRec,
	weightingVector, analysisType, varMeans, varStdDevs)
{
	// dataBlock must be a 2-D array of data having countRec rows and countVar columns
	if (dataBlock == null)
	{
		// error
	}
	if (countRec <= 0) // count of records in data block, must be a numeric >= 1
	{
		// error
	}
	if (countVar <= 0) // count of variables in data, must be a numeric >= 1
	{
		// error
	}
	if (rec1 <= 0) // first record in data block, must be a numeric >= 1
	{
		// error
	}
	if (countConsecRec <= 0 || countConsecRec > countRec + 1 - rec1)
			// count of consec records beginning at rec1
			// must be > 1 and < countRec + 1 - rec1
	{
		// error
	}
		// a weightingVector is a column of countRec values for weighting rows
	if (weightingVector != null && typeof(weightingVector) == "object" &&
				weightingVector.length == countRec)
		this.weights = weightingVector;
	if (analysisType == SUMS_OF_SQUARES_CROSS_PRODUCTS ||
				analysisType == VARIANCE_COVARIANCE_MATRIX ||
				analysisType == CORRELATION_MATRIX ||
				analysisType == USER_SPECIFIED_STANDARDIZATION)
		this.analysisType = analysisType;
	if (varMeans != null) // a vector of means already provided
	{
		this.weights = null;  // weighting is ignored in this case
		this.varMeans = varMeans;
		// if not specified, the variable means will be calculated
	}
	if (varStdDevs != null) // a vector of standard deviations or scaling factors
	{
		// for analysisType == VARIANCE_COVARIANCE_MATRIX, these can be provided
		// put in varStdDevs any user-specified standardizations.
		// for the other analysis types, this will NOT be used
		this.varStdDevs = varStdDevs;
	}
	this.loadings = null; // a countVar X countVar matrix as output
	this.results = null; /* a countVar x 6 array:
results[i][0] = eigenvalue for variable
results[i][1] = proportion of variation explained by component
results[i][2] = cumulative proportion of variation explained by components
results[i][3] = chi-square statistic
results[i][4] = degrees of freedom
results[i][5] = significance
*/
	this.error = -1; // error info:  0=success, 51=all eigenvalues 0 (null matrix),  sum weights < 1
}

function totalPCA(PCAset)
{
	if (PCAset == null)
	{
		// error
	}
}
